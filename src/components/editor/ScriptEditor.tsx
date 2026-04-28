"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { Copy, Save, Sparkles, RefreshCw } from "lucide-react";

interface ScriptEditorProps {
  content: string;
  isGenerating: boolean;
  onSave?: (content: string) => void;
  onRegenerate?: () => void;
}

export function ScriptEditor({ content, isGenerating, onSave, onRegenerate }: ScriptEditorProps) {
  const editor = useEditor({
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
          "prose prose-invert prose-p:text-[var(--text-secondary)] prose-headings:text-white max-w-none focus:outline-none min-h-[500px]",
      },
    },
  });

  // Update editor content when streaming content from AI changes
  useEffect(() => {
    if (editor && content !== editor.getHTML() && isGenerating) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor, isGenerating]);

  const handleCopy = () => {
    if (!editor) return;
    navigator.clipboard.writeText(editor.getText());
    alert("Copied to clipboard!");
  };

  const handleSave = () => {
    if (!editor || !onSave) return;
    onSave(editor.getHTML());
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl overflow-hidden shadow-lg">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[rgba(108,71,255,0.1)] text-[var(--primary-light)] font-medium text-sm">
            <Sparkles size={16} />
            {isGenerating ? "AI is writing..." : "Editor"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="p-2 text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-md transition-colors disabled:opacity-50"
              title="Regenerate"
            >
              <RefreshCw size={18} className={isGenerating ? "animate-spin text-[var(--primary-light)]" : ""} />
            </button>
          )}
          <button
            onClick={handleCopy}
            className="p-2 text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-md transition-colors"
            title="Copy to clipboard"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={handleSave}
            disabled={isGenerating || !content}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-md font-medium transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
        {isGenerating && content.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
            <div className="w-12 h-12 border-4 border-[rgba(108,71,255,0.2)] border-t-[var(--primary-light)] rounded-full animate-spin" />
            <p>Analyzing your voice DNA and writing script...</p>
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
