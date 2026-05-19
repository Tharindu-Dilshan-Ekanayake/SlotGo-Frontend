import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaEye, FaTimes, FaTrash } from 'react-icons/fa';
import { getMessages, deleteMessage } from '../../apis/messagesApi';
import Pagination from '../../components/Pagination';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const itemsPerPage = 8;

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getMessages();
      setMessages(data || []);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id);
        toast.success('Message deleted successfully');
        loadMessages();
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const currentMessages = messages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section>
      <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#18a84b]">Admin</p>
      <div className="flex flex-col gap-4 mt-2 sm:flex-row sm:items-end sm:justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#071633] sm:text-3xl">Support Messages</h1>
        <button
          className="inline-flex h-10 w-fit items-center justify-center rounded-lg border border-[#b8d5f0] bg-white px-4 text-sm font-extrabold text-[#0c67d9] transition hover:border-[#0c67d9] active:translate-y-[1px]"
          onClick={loadMessages}
          type="button"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#dce8f7] bg-white shadow-sm">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[0.5fr_1fr_1.5fr_2fr_1fr_0.5fr] items-center gap-4 border-b border-[#edf1f7] bg-[#f8fbff] px-5 py-4 text-sm font-extrabold text-[#10224a]">
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Message</span>
            <span>Date</span>
            <span className="text-center">Actions</span>
          </div>

          <div className="divide-y divide-[#edf1f7]">
            {isLoading ? (
              <div className="px-5 py-8 text-center text-sm font-semibold text-[#64748b]">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm font-semibold text-[#64748b]">
                No messages found.
              </div>
            ) : (
              currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="grid grid-cols-[0.5fr_1fr_1.5fr_2fr_1fr_0.5fr] items-center gap-4 px-5 py-4 transition hover:bg-[#f8fbff]"
                >
                  <span className="text-sm font-bold text-[#64748b]">#{msg.id}</span>
                  <span className="text-sm font-extrabold text-[#10224a]">
                    {msg.firstName} {msg.lastName}
                  </span>
                  <span className="text-sm font-medium text-[#0c67d9] truncate">
                    {msg.email}
                  </span>
                  <span className="text-sm font-medium text-[#64748b] truncate max-w-full" title={msg.queryScope}>
                    {msg.queryScope}
                  </span>
                  <span className="text-sm font-medium text-[#64748b]">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="inline-flex h-8 w-8 text-[#0c67d9] hover:bg-blue-50 rounded items-center justify-center transition"
                      onClick={() => setSelectedMessage(msg)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="inline-flex h-8 w-8 text-red-500 hover:bg-red-50 rounded items-center justify-center transition"
                      onClick={() => handleDelete(msg.id)}
                      title="Delete Message"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {!isLoading && messages.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={messages.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071633]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#edf1f7] bg-[#f8fbff]">
              <h3 className="text-lg font-black text-[#10224a]">Support Ticket #{selectedMessage.id}</h3>
              <button 
                className="text-[#64748b] hover:text-[#0c67d9] hover:bg-white p-2 rounded-lg transition"
                onClick={() => setSelectedMessage(null)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6 mb-6">
                 <div>
                   <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Sender Name</p>
                   <p className="text-base font-extrabold text-[#10224a]">{selectedMessage.firstName} {selectedMessage.lastName}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Email Address</p>
                   <p className="text-base font-extrabold text-[#0c67d9]">
                     <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                   </p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Submitted On</p>
                   <p className="text-sm font-semibold text-[#10224a]">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                 </div>
              </div>
              <div>
                 <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Message Content</p>
                 <div className="bg-[#f8fbff] border border-[#edf1f7] rounded-xl p-5 text-sm font-medium text-[#10224a] leading-relaxed whitespace-pre-wrap">
                   {selectedMessage.queryScope}
                 </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#edf1f7] bg-slate-50 flex justify-end gap-3 shrink-0">
               <button 
                 className="px-5 py-2.5 rounded-xl font-extrabold text-[#64748b] bg-white border border-[#dce8f7] hover:bg-slate-50 transition"
                 onClick={() => setSelectedMessage(null)}
               >
                 Close window
               </button>
               <a 
                 className="px-5 py-2.5 rounded-xl font-extrabold text-white bg-[#0c67d9] hover:bg-[#0a52b0] shadow-md transition flex items-center gap-2"
                 href={`mailto:${selectedMessage.email}?subject=RE: Support Ticket #${selectedMessage.id} - SlotGo`}
               >
                 Reply via Email
               </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
