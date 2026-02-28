'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManageTags() {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch tags when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error('Failed to fetch tags', err);
    }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: newTag.trim() }),
      });
      if (res.ok) {
        setNewTag('');
        fetchTags(); // Refresh list
        router.refresh(); // Refresh page content that uses tags
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    if (!confirm(`Are you sure you want to delete tag "${tagToDelete}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/tags', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: tagToDelete }),
      });
      if (res.ok) {
        fetchTags();
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-black transition-colors bg-white border border-gray-200 px-3 py-1.5 rounded-sm hover:border-black gap-2 ml-2"
        title="Manage Tags"
      >
        Tags <Tag className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold">Manage Tags</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <form onSubmit={handleAddTag} className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag name..."
                  className="flex-1 p-2 border border-gray-200 rounded-sm focus:border-black outline-none text-sm"
                  autoFocus
                />
                <button 
                  type="submit" 
                  disabled={loading || !newTag.trim()}
                  className="bg-black text-white px-3 py-2 rounded-sm text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {tags.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">No tags yet.</p>
                ) : (
                  tags.map((tag) => (
                    <div key={tag} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors group">
                      <span className="text-sm font-medium">{tag}</span>
                      <button
                        onClick={() => handleDeleteTag(tag)}
                        disabled={loading}
                        className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                        title="Delete Tag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 text-xs text-gray-700 text-center">
              Tags are used to categorize blog posts. Deleting a tag does not delete posts.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
