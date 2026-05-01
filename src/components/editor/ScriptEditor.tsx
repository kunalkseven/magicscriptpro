"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Copy, Save, Sparkles, RefreshCw, Check, Clock, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ScriptEditorProps {
  content: string;
  isGenerating: boolean;
  onSave?: (content: string) => void;
  onRegenerate?: () => void;
}

export function ScriptEditor({ content, isGenerating, onSave, onRegenerate }: ScriptEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm prose-p:text-white/50 prose-headings:text-white prose-headings:font-bold max-w-none focus:outline-none min-h-[500px] leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML() && isGenerating) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor, isGenerating]);

  const handleCopy = () => {
    if (!editor) return;
    navigator.clipboard.writeText(editor.getText());
  };

  const handleSave = () => {
    if (!editor || !onSave) return;
    onSave(editor.getHTML());
  };

  return (
    <div className="flex flex-col h-full bg-[#0D0E14] border border-white/[0.07] rounded-2xl overflow-hidden relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div 
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#6C47FF]/10 border border-[#6C47FF]/20 text-[#6C47FF] font-semibold text-[11px] uppercase tracking-wider"
              >
                <div className="flex gap-1">
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1 h-1 rounded-full bg-[#6C47FF]" />
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full bg-[#6C47FF]" />
                  <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full bg-[#6C47FF]" />
                </div>
                AI Writing...
              </motion.div>
            ) : (
              <motion.div 
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 font-semibold text-[11px] uppercase tracking-wider"
              >
                <Wand2 size={12} className="text-[#6C47FF]" />
                Draft Editor
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-50"
              title="Regenerate"
            >
              <RefreshCw size={16} className={isGenerating ? "animate-spin text-[#6C47FF]" : ""} />
            </button>
          )}
          
          <button
            onClick={handleCopy}
            className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            title="Copy"
          >
            <Copy size={16} />
          </button>

          <div className="w-px h-5 bg-white/[0.06] mx-1" />

          <button
            onClick={handleSave}
            disabled={isGenerating || !content}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6C47FF] to-[#EC4899] text-white rounded-lg font-semibold text-sm transition-all shadow-lg shadow-[#6C47FF]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Save size={14} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative">
        <AnimatePresence>
          {isGenerating && content.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-5"
            >
              <div className="relative">
                <div className="w-16 h-16 border-2 border-[#6C47FF]/10 rounded-full animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-0 w-16 h-16 border-t-2 border-[#6C47FF] rounded-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-[#6C47FF] animate-pulse" size={24} />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-base font-bold text-white/30">Generating Script</p>
                <p className="text-sm text-white/15">Analyzing voice profile & platform constraints...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className={isGenerating && content.length === 0 ? "opacity-0" : "opacity-100 transition-opacity duration-700"}>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/20 uppercase tracking-wider">
               <Clock size={10} />
               Drafted in 4.2s
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="text-[10px] font-semibold text-white/20 uppercase tracking-wider">
               {editor?.getText().split(' ').length || 0} Words
            </div>
         </div>
         <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6C47FF] uppercase tracking-wider">
            <Check size={10} />
            Synced
         </div>
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(255, 255, 255, 0.1);
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
