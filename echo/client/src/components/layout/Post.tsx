import { Heart, Repeat2, Bookmark, User, Ellipsis } from "lucide-react";

import PostType from '../../types/post';
import formatDate from "../../utils/formatDate";
import React, { useEffect, useState } from "react";


type Props = {
    id: PostType['id'],
    authorId: PostType['author_id'],
    authorName: PostType['author_username'],
    authorAvatar: PostType['author_avatar'],
    content: PostType['content'],
    likes: PostType['likes'],
    reposts: PostType['reposts'],
    saves: PostType['saves'],
    comments: PostType['comments'],
    createdAt: PostType['created_at'],
    isLoggedIn: boolean
};

const Post = (props: Props) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [isAuthor, setIsAuthor] = useState<boolean>(false);
    const [isOptions, setIsOptions] = useState<boolean>(false);

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isDelete, setIsDelete] = useState<boolean>(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const req = await fetch('/api/post/status', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id: props.id})
                });
                const res = await req.json();

                console.log(res)

                if (res.ok) {
                    setIsLiked(res.is_liked);
                    setIsReposted(res.is_reposted);
                    setIsSaved(res.is_saved);
                    setIsAuthor(res.is_author);
                } else {
                    throw new Error(res.error);
                };
            } catch(e) {
                console.error("Error checking post status:", e);
            };
        };

        checkStatus();
    }, [props.id]);

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            const form = new FormData(e.currentTarget);
            const formData = Object.fromEntries(form);

            const req = await fetch('/api/post/update', {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: props.id,
                    authorId: props.authorId,
                    content: formData.content
                })
            });
            const res = await req.json();

            if (res.ok) {
                setIsEdit(false);
                setIsOptions(false);

                props.content = formData.content as string;
            } else {
                throw new Error(res.error);
            };
        } catch (e) {
            console.error("Error handling edit:", e);
        };
    };

    const handleDelete = async () => {
        try {
            const req = await fetch('/api/post/delete', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: props.id,
                    authorId: props.authorId
                })
            })
            const res = await req.json();

            if (res.ok) {
                setIsDelete(false);
                setIsOptions(false);
            } else {
                throw new Error(res.error);
            };
        } catch (e) {
            console.error("Error handling delete:", e);
        };
    };

    const handleLike = async () => {
        try {
            const req = await fetch('/api/post/like', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: props.id,
                    liked: isLiked
                })
            })
            const res = await req.json()

            if (res.ok) {
                setIsLiked(!isLiked);
            } else {
                throw new Error(res.error);
            };
        } catch (e) {
            console.error("Error handling like:", e);
        };
    };

    const handleRepost = async () => {
        try {
            const req = await fetch('/api/post/repost', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: props.id,
                    reposted: isReposted
                })
            })
            const res = await req.json()

            if (res.ok) {
                setIsReposted(!isReposted);
            } else {
                throw new Error(res.error);
            };
        } catch (e) {
            console.error("Error handling repost:", e);
        };
    };

    const handleSave = async () => {
        try {
            const req = await fetch('/api/post/save', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: props.id,
                    saved: isSaved
                })
            })
            const res = await req.json()

            if (res.ok) {
                setIsSaved(!isSaved);
            } else {
                throw new Error(res.error);
            };
        } catch (e) {
            console.error("Error handling save:", e);
        };
    };

    return (
        <section
            id={`${props.id}`}
            className="min-h-20 w-1/2 relative flex flex-col p-2 border border-border rounded-lg bg-surface">
            <div className="flex flex-row items-baseline justify-between">

                { isEdit && (
                    <div className="modal flex">
                        <div className="modal-overlay"></div>

                        <form
                            className="modal-form"
                            onSubmit={handleEdit}>
                            <h2>Edit Post</h2>

                            <div>
                                <label className="text-base" htmlFor="content">Edit your post:</label>

                                <textarea
                                    name="content"
                                    className="min-h-28 max-h-72 w-full resize-y p-2 rounded-lg border border-border text-xl"
                                    placeholder="Write something..."
                                    maxLength={400}
                                    required
                                />
                                </div>

                            <div className="w-full absolute bottom-4">
                                <button
                                    className="secondary"
                                    onClick={() => {
                                        setIsEdit(false)
                                        setIsOptions(false)
                                    }}>
                                    Cancel
                                </button>

                                <button
                                    className="absolute right-8 primary"
                                    type="submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                { isDelete && (
                    <div className="modal flex">
                        <div className="modal-overlay"></div>

                        <div className="h-44 modal-form">
                            <h2>Are you sure you want to delete this post?</h2>
                            <p>This action cannot be undone.</p>

                            <div className="w-full absolute bottom-4">
                                <button
                                    className="secondary"
                                    onClick={() => setIsDelete(false)}>
                                    Cancel
                                </button>

                                <button
                                    className="absolute right-8 danger"
                                    onClick={handleDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-row items-center">
                    {props.authorAvatar ? (
                        <img
                            className="h-8 w-8 border-2 border-surface-muted rounded-full"
                            src={props.authorAvatar}
                            alt={`${props.authorName}'s avatar`}
                        />
                    ) : (
                        <User
                            className="rounded-full stroke-smoke"
                            size={24}
                        />
                    )}
                    <p className="text-snow font-bold">{props.authorName}</p>
                </div>

                <div className="flex flex-row items-center">
                    { isAuthor && (
                        <>
                            <button
                                onClick={() => setIsOptions(!isOptions)}
                                aria-label="Post options">
                                <Ellipsis
                                    className="icon"
                                    size={18}
                                />
                            </button>

                            {isOptions && (
                                <div className="w-44 absolute top-1/2 -right-36 -translate-y-1/2 z-10 flex flex-row items-center justify-between p-2 border border-border rounded-lg bg-surface">
                                    <button
                                        onClick={() => {
                                            setIsEdit(true)
                                            console.log(isEdit)
                                        }}
                                        className="secondary">
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => setIsDelete(true)}
                                        className="danger">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    <p>{formatDate(props.createdAt)}</p>
                </div>
            </div>

            <p>{props.content}</p>

            <div className="flex flex-row justify-around">
                <button
                    onClick={handleLike}
                    aria-label="Like post">
                    <Heart
                        className={`icon ${isLiked ? 'fill-red-400 stroke-red-400' : 'fill-surface stroke-smoke'} hover:fill-red-400 hover:stroke-red-400 focus-visible:fill-red-400 focus-visible:stroke-red-400`}
                        size={24}
                    />
                </button>

                <button
                    onClick={handleRepost}
                    aria-label="Repost">
                    <Repeat2
                        className={`icon fill-surface ${isReposted ? 'stroke-green-400' : 'stroke-smoke'} hover:stroke-green-400 focus-visible:stroke-green-400`}
                        size={24}
                    />
                </button>

                <button
                    onClick={handleSave}
                    aria-label="Bookmark post">
                    <Bookmark
                        className={`icon ${isSaved ? 'fill-blue-400 stroke-blue-400' : 'fill-surface stroke-smoke'} hover:fill-blue-400 hover:stroke-blue-400 focus-visible:fill-blue-400 focus-visible:stroke-blue-400`}
                        size={24}
                    />
                </button>
            </div>
        </section>
    )
};

export default Post;