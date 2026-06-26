import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit3, Trash2, BookOpen, Heart, Lightbulb, Smile } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard, GlassButton, GlassTextarea, GlassInput } from './Glass';
import { Note } from '../types';
import { getTodayString } from '../utils/storage';

type NoteType = 'journal' | 'reflection' | 'gratitude' | 'idea';

const noteTypes: { id: NoteType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'journal', label: 'Journal', icon: BookOpen, color: '#a78bfa' },
  { id: 'reflection', label: 'Reflection', icon: Heart, color: '#f87171' },
  { id: 'gratitude', label: 'Gratitude', icon: Smile, color: '#fbbf24' },
  { id: 'idea', label: 'Ideas', icon: Lightbulb, color: '#22c55e' },
];

export function NotesScreen() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeFilter, setActiveFilter] = useState<NoteType | 'all'>('all');

  const filteredNotes = useMemo(() => {
    let notes = [...state.notes].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    if (activeFilter !== 'all') {
      notes = notes.filter(n => n.type === activeFilter);
    }
    return notes;
  }, [state.notes, activeFilter]);

  const handleSave = (note: Note) => {
    if (editingNote) {
      dispatch({ type: 'UPDATE_NOTE', payload: note });
    } else {
      dispatch({ type: 'ADD_NOTE', payload: note });
    }
    setShowForm(false);
    setEditingNote(null);
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: id });
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  return (
    <div className="pb-28 px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-light text-white">Notes & Journal</h1>
        <p className="text-white/50 text-sm mt-1">
          {state.notes.length} entries
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ scrollbarWidth: 'none' }}
      >
        <FilterButton
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
          label="All"
        />
        {noteTypes.map((type) => {
          const Icon = type.icon;
          return (
            <FilterButton
              key={type.id}
              active={activeFilter === type.id}
              onClick={() => setActiveFilter(type.id)}
              icon={<Icon size={16} />}
              label={type.label}
              color={type.color}
            />
          );
        })}
      </motion.div>

      {/* Notes List */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredNotes.length === 0 ? (
            <GlassCard className="text-center py-12">
              <BookOpen size={40} className="mx-auto mb-3 text-white/20" />
              <p className="text-white/50 mb-4">No entries yet</p>
              <GlassButton onClick={() => setShowForm(true)}>
                <Plus size={18} className="mr-2" /> Write your first note
              </GlassButton>
            </GlassCard>
          ) : (
            filteredNotes.map((note, index) => {
              const noteType = noteTypes.find(t => t.id === note.type);
              const Icon = noteType?.icon || BookOpen;
              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="group">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: `${noteType?.color}20`,
                          border: `1px solid ${noteType?.color}40`,
                        }}
                      >
                        <Icon size={18} style={{ color: noteType?.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/50 text-xs">
                            {new Date(note.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: `${noteType?.color}20`,
                              color: noteType?.color,
                            }}
                          >
                            {noteType?.label}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm line-clamp-3">
                          {note.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-sm flex items-center justify-center gap-2"
                        onClick={() => handleEdit(note)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Edit3 size={14} /> Edit
                      </motion.button>
                      <motion.button
                        className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm flex items-center justify-center gap-2"
                        onClick={() => handleDelete(note.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 size={14} /> Delete
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Button FAB */}
      <motion.button
        className="fixed right-6 bottom-24 w-14 h-14 rounded-full flex items-center justify-center z-40"
        style={{
          background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.6) 0%, rgba(139, 92, 246, 0.6) 100%)',
          boxShadow: '0 0 30px rgba(167, 139, 250, 0.5)',
        }}
        onClick={() => setShowForm(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Plus size={28} color="white" />
      </motion.button>

      {/* Note Form Modal */}
      <AnimatePresence>
        {showForm && (
          <NoteForm
            note={editingNote}
            onClose={() => {
              setShowForm(false);
              setEditingNote(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <motion.button
      className="flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap"
      style={{
        background: active
          ? color
            ? `${color}30`
            : 'rgba(167, 139, 250, 0.3)'
          : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${active
          ? color
            ? `${color}50`
            : 'rgba(167, 139, 250, 0.4)'
          : 'rgba(255, 255, 255, 0.1)'
        }`,
        color: active ? 'white' : 'rgba(255,255,255,0.6)',
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}

function NoteForm({
  note,
  onClose,
  onSave,
}: {
  note: Note | null;
  onClose: () => void;
  onSave: (note: Note) => void;
}) {
  const [content, setContent] = useState(note?.content || '');
  const [type, setType] = useState<NoteType>(note?.type || 'journal');
  const [date, setDate] = useState(note?.date || getTodayString());

  const handleSave = () => {
    if (!content.trim()) return;
    onSave({
      id: note?.id || Date.now().toString(),
      content: content.trim(),
      type,
      date,
      createdAt: note?.createdAt || new Date().toISOString(),
    } as Note);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-light text-white">
            {note ? 'Edit Note' : 'New Entry'}
          </h2>
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} className="text-white/70" />
          </motion.button>
        </div>

        <div className="p-4 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="text-white/60 text-sm mb-3 block">Type</label>
            <div className="grid grid-cols-2 gap-3">
              {noteTypes.map((t) => {
                const Icon = t.icon;
                const isSelected = type === t.id;
                return (
                  <motion.button
                    key={t.id}
                    className="p-3 rounded-xl flex items-center gap-3"
                    style={{
                      background: isSelected ? `${t.color}20` : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isSelected ? `${t.color}50` : 'rgba(255, 255, 255, 0.1)'}`,
                    }}
                    onClick={() => setType(t.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={18} style={{ color: t.color }} />
                    <span className="text-white/80 text-sm">{t.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Date</label>
            <GlassInput
              value={date}
              onChange={setDate}
              type="date"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Content</label>
            <GlassTextarea
              value={content}
              onChange={setContent}
              placeholder="Write your thoughts..."
              rows={6}
            />
          </div>

          {/* Writing prompts based on type */}
          <GlassCard className="p-3">
            <p className="text-white/50 text-xs">
              {type === 'journal' && 'What happened today? How did you feel?'}
              {type === 'reflection' && 'What did you learn? What would you do differently?'}
              {type === 'gratitude' && 'What are you grateful for today? Small or big...'}
              {type === 'idea' && 'What new ideas or insights do you have?'}
            </p>
          </GlassCard>

          {/* Save Button */}
          <GlassButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSave}
            disabled={!content.trim()}
          >
            {note ? 'Save Changes' : 'Save Entry'}
          </GlassButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
