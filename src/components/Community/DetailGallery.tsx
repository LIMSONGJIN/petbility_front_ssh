"use client";

import { useParams } from "next/navigation";
import { memorials, comments } from "@/data/service";
import Image from "next/image";
import { useState } from "react";
import { Heart, MessageSquare } from "lucide-react";

export default function MemorialPostDetail() {
  const { post_id } = useParams();
  const post = memorials.find((p) => p.post_id === post_id);
  const [likes, setLikes] = useState(post?.likes || 0);

  if (!post) {
    return (
      <section className="container mx-auto py-12 px-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">
          게시글을 찾을 수 없습니다.
        </h2>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-12 px-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
        {/* 반응형 이미지 */}
        {post.image_url && (
          <div className="w-full max-w-full flex justify-center">
            <Image
              src={post.image_url}
              alt="Post Image"
              width={800}
              height={600}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
              style={{ aspectRatio: "auto" }}
            />
          </div>
        )}

        {/* 게시물 내용 */}
        <h2 className="text-3xl font-bold text-gray-800 mt-6">{post.title}</h2>
        <p className="text-gray-700 mt-4">{post.content}</p>

        {/* 좋아요 & 댓글 */}
        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <span className="flex items-center gap-1">
            <Heart size={16} className="text-red-500" /> {likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={16} className="text-blue-500" />{" "}
            {post.comments_count}
          </span>
        </div>

        {/* 좋아요 버튼 */}
        <button
          className="mt-4 bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 flex items-center gap-2"
          onClick={() => setLikes((prev) => prev + 1)}
        >
          <Heart size={18} /> 좋아요
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-8 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💬 댓글</h3>
        {comments
          .filter((comment) => comment.post_id === post_id)
          .map((comment) => (
            <div
              key={comment.comment_id}
              className="bg-gray-100 p-4 rounded-lg mb-3"
            >
              <p className="text-gray-700">{comment.content}</p>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Heart size={14} className="text-red-400" /> {comment.likes}
              </span>
            </div>
          ))}
      </div>
    </section>
  );
}
