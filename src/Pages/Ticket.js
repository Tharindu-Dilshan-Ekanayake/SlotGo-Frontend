import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCarSide,
  FaClock,
  FaParking,
} from "react-icons/fa";

import toast from "react-hot-toast";

import {
  addAdditionalPackageToParking,
  getAdditionalParkingPackages,
  getParkingByToken,
} from "../apis/publicParkingApi";

const getPackageFee = (feePackage) => {
  if (!feePackage) {
    return 0;
  }

  const baseFee = Number(feePackage.fee ?? feePackage.packagePrice ?? 0);

  const discount = Number(feePackage.discount ?? feePackage.offer ?? 0);

  return Number((baseFee - baseFee * (discount / 100)).toFixed(2));
};

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`;

const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString();
};

const formatDuration = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor((totalSeconds % 86400) / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
};

export default function Ticket() {
  const { token } = useParams();

  const [parking, setParking] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [now, setNow] = useState(() => Date.now());

  const [additionalPackages, setAdditionalPackages] = useState([]);

  const [selectedAdditionalPackageId, setSelectedAdditionalPackageId] =
    useState("");

  const [isAddingAdditional, setIsAddingAdditional] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError("");

      try {
        const record = await getParkingByToken(token);

        if (!isMounted) return;

        setParking(record);
      } catch (loadError) {
        if (!isMounted) return;

        setError(
          loadError?.response?.data?.message ||
            loadError?.message ||
            "Unable to load parking ticket details.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    const loadAdditionalPackages = async () => {
      try {
        const list = await getAdditionalParkingPackages();

        if (!isMounted) return;

        setAdditionalPackages(Array.isArray(list) ? list : []);
      } catch (error) {}
    };

    loadAdditionalPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  const timeInfo = useMemo(() => {
    if (!parking?.parkEndTime) {
      return {
        label: "Time Left",
        value: "-",
        diffMs: null,
      };
    }

    const endTime = new Date(parking.parkEndTime).getTime();

    const diff = endTime - now;

    if (Number.isNaN(endTime)) {
      return {
        label: "Time Left",
        value: "-",
        diffMs: null,
      };
    }

    if (diff <= 0) {
      return {
        label: "Time Left",
        value: "Expired",
        diffMs: 0,
      };
    }

    return {
      label: "Time Left",
      value: formatDuration(diff),
      diffMs: diff,
    };
  }, [parking, now]);

  const totalFees = useMemo(() => {
    if (!parking) {
      return 0;
    }

    const raw = Number(parking.fullFees);

    if (!Number.isNaN(raw) && raw > 0) {
      return raw;
    }

    return getPackageFee(parking.feePackage);
  }, [parking]);

  const canAddAdditionalPackage =
    !!parking?.id &&
    parking?.end !== true &&
    typeof timeInfo.diffMs === "number" &&
    timeInfo.diffMs > 0 &&
    timeInfo.diffMs <= 30 * 60 * 1000;

  const handleAddAdditionalPackage = async () => {
    if (!parking?.id) {
      toast.error("Missing parking id.");
      return;
    }

    if (!selectedAdditionalPackageId) {
      toast.error("Select an additional package.");
      return;
    }

    setIsAddingAdditional(true);

    try {
      await addAdditionalPackageToParking(
        parking.id,
        selectedAdditionalPackageId,
      );

      toast.success("Additional time added.");

      const updated = await getParkingByToken(token);

      setParking(updated);

      setSelectedAdditionalPackageId("");
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message ||
          submitError?.message ||
          "Unable to add additional package.",
      );
    } finally {
      setIsAddingAdditional(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-5 py-10 text-[#071633] sm:px-8">
      <div className="w-full max-w-3xl mx-auto">
        <Link
          className="inline-flex items-center gap-2 text-sm font-extrabold text-[#0c67d9]"
          to="/"
        >
          <FaArrowLeft className="text-[12px]" aria-hidden="true" />
          Back to Home
        </Link>

        <div className="mt-4 rounded-lg border border-[#dce8f7] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#18a84b]">
                Parking Ticket
              </p>

              <h1 className="mt-2 text-2xl font-extrabold text-[#071633] sm:text-3xl">
                QR Ticket Details
              </h1>

              <p className="mt-2 break-all text-xs font-semibold text-[#64748b]">
                {token}
              </p>
            </div>

            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#e7f0ff] text-[#0c67d9]">
              <FaParking className="text-[20px]" aria-hidden="true" />
            </span>
          </div>

          {isLoading ? (
            <p className="mt-6 text-sm font-semibold text-[#64748b]">
              Loading ticket details...
            </p>
          ) : error ? (
            <p className="px-3 py-2 mt-6 text-sm font-semibold text-red-600 border border-red-200 rounded-lg bg-red-50">
              {error}
            </p>
          ) : !parking ? (
            <p className="mt-6 text-sm font-semibold text-[#64748b]">
              No parking record found.
            </p>
          ) : (
            <div className="grid gap-4 mt-6 sm:grid-cols-2">
              <div className="rounded-lg border border-[#edf1f7] bg-[#f8fbff] p-4">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#536582]">
                  <FaCarSide /> Vehicle
                </p>

                <p className="mt-2 text-lg font-extrabold text-[#071633]">
                  {parking.vehicleNumber || "-"}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#64748b]">
                  {parking.vehicleOwnerName || "-"}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#64748b]">
                  {parking.vehicleOwnerTelephone || "-"}
                </p>
              </div>

              <div className="rounded-lg border border-[#edf1f7] bg-[#f8fbff] p-4">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#536582]">
                  <FaClock /> {timeInfo.label}
                </p>

                <p
                  className={`mt-2 text-lg font-extrabold ${
                    timeInfo.value === "Expired"
                      ? "text-red-600"
                      : timeInfo.diffMs <= 30 * 60 * 1000
                        ? "text-orange-500"
                        : "text-[#071633]"
                  }`}
                >
                  {timeInfo.value}
                </p>

                <p className="mt-3 text-xs font-semibold text-[#64748b]">
                  Parked: {formatDateTime(parking.parkedTime)}
                </p>

                <p className="mt-1 text-xs font-semibold text-[#64748b]">
                  Ends: {formatDateTime(parking.parkEndTime)}
                </p>
              </div>

              <div className="rounded-lg border border-[#edf1f7] bg-[#f8fbff] p-4">
                <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#536582]">
                  <FaParking /> Slot
                </p>

                <p className="mt-2 text-lg font-extrabold text-[#071633]">
                  {parking.parkingSlot?.name || parking.slotId || "-"}
                </p>
              </div>

              <div className="rounded-lg border border-[#edf1f7] bg-[#f8fbff] p-4 sm:col-span-2">
                <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0c67d9]">
                  Payment Summary
                </p>

                <div className="grid gap-3 mt-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-white p-4 border border-[#dce8f7]">
                    <p className="text-xs font-bold uppercase text-[#64748b]">
                      Base Package
                    </p>

                    <p className="mt-2 text-lg font-extrabold text-[#071633]">
                      {parking.feePackage?.timeDuration || "-"}
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#18a84b]">
                      {formatCurrency(getPackageFee(parking.feePackage))}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white p-4 border border-[#dce8f7]">
                    <p className="text-xs font-bold uppercase text-[#64748b]">
                      Additional Time
                    </p>

                    <p className="mt-2 text-lg font-extrabold text-[#071633]">
                      {parking.additionalFeePackage?.hours
                        ? `${parking.additionalFeePackage.hours} Hour`
                        : "No Additional Time"}
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#18a84b]">
                      {parking.additionalFeePackage
                        ? formatCurrency(
                            getPackageFee(parking.additionalFeePackage),
                          )
                        : formatCurrency(0)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-[#0c67d9] p-4 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.08em]">
                    Total Amount
                  </p>

                  <p className="mt-2 text-3xl font-extrabold">
                    {formatCurrency(totalFees)}
                  </p>
                </div>
              </div>

              {canAddAdditionalPackage ? (
                <div className="rounded-lg border border-[#edf1f7] bg-[#f8fbff] p-4 sm:col-span-2">
                  <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0c67d9]">
                    Additional Time
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#64748b]">
                    Available only when less than 30 minutes remain.
                  </p>

                  <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center">
                    <select
                      className="h-10 w-full rounded-lg border border-[#b8d5f0] bg-white px-3 text-sm font-bold text-[#10224a] outline-none focus:border-[#18a84b] focus:ring-4 focus:ring-[#18a84b]/15"
                      onChange={(event) =>
                        setSelectedAdditionalPackageId(event.target.value)
                      }
                      value={selectedAdditionalPackageId}
                    >
                      <option value="">Select additional package</option>

                      {additionalPackages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.hours ? `${pkg.hours} Hour` : pkg.timeDuration} -{" "}
                          {formatCurrency(getPackageFee(pkg))}
                        </option>
                      ))}
                    </select>

                    <button
                      className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#18a84b] px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition hover:bg-[#139241] disabled:cursor-not-allowed disabled:bg-[#8bcfa4]"
                      disabled={isAddingAdditional}
                      onClick={handleAddAdditionalPackage}
                      type="button"
                    >
                      {isAddingAdditional ? "Adding..." : "Add Time"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
