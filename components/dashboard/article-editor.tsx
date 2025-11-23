"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Article } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Loader2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleEditorProps {
  mode: "create" | "edit";
  article?: Article;
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

interface ToolbarBtnProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}

// Move component OUTSIDE render
function ToolbarBtn({ onClick, isActive, children, disabled }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-2 rounded-lg transition-colors",
        isActive ? "bg-emerald-100 text-emerald-700" : "text-gray-600 hover:bg-gray-100",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

export function ArticleEditor({
  article,
  onSubmit,
  isSubmitting,
}: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    article?.featured_image
      ? `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${article.featured_image}`
      : null
  );
  const [activeTab, setActiveTab] = useState("write");

  // Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
      Underline,
    ],
    content: article?.content || "",
    editorProps: {
      attributes: {
        class: "prose prose-emerald max-w-none min-h-[400px] focus:outline-none px-4 py-3",
      },
    },

    immediatelyRender: false,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (published: boolean) => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!editor?.getHTML() || editor.isEmpty) {
      alert("Content is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editor.getHTML());
    formData.append("excerpt", excerpt);
    formData.append("published", String(published));
    if (imageFile) formData.append("featured_image", imageFile);

    await onSubmit(formData);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link href="/Adminarticles">
          <Button variant="ghost" className="gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit(false)} disabled={isSubmitting} className="cursor-pointer">
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer" onClick={() => handleSubmit(true)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-xl border p-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title..."
              className="text-2xl font-bold border-0 p-0 focus-visible:ring-0"
            />
          </div>

          {/* Editor */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-4 py-2">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>

              {activeTab === "write" && (
                <div className="border-b px-2 py-2 flex flex-wrap gap-1">
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive("bold")}>
                    <Bold className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive("italic")}>
                    <Italic className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} isActive={editor?.isActive("underline")}>
                    <UnderlineIcon className="w-4 h-4" />
                  </ToolbarBtn>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor?.isActive("heading", { level: 1 })}>
                    <Heading1 className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor?.isActive("heading", { level: 2 })}>
                    <Heading2 className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor?.isActive("heading", { level: 3 })}>
                    <Heading3 className="w-4 h-4" />
                  </ToolbarBtn>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive("bulletList")}>
                    <List className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive("orderedList")}>
                    <ListOrdered className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} isActive={editor?.isActive("blockquote")}>
                    <Quote className="w-4 h-4" />
                  </ToolbarBtn>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()}>
                    <Undo className="w-4 h-4" />
                  </ToolbarBtn>
                  <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()}>
                    <Redo className="w-4 h-4" />
                  </ToolbarBtn>
                </div>
              )}

              <TabsContent value="write" className="mt-0">
                <EditorContent editor={editor} />
              </TabsContent>
              <TabsContent value="preview" className="mt-0 p-4">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-xl border p-4">
            <Label className="mb-3 block">Featured Image</Label>
            {imagePreview ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:border-emerald-500">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border p-4">
            <Label htmlFor="excerpt" className="mb-2 block">Excerpt</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief description..." rows={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
