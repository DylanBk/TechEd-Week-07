import { useEffect, useState, useRef } from "react";
import { Plus } from "lucide-react";

import Header from "../../layout/Header";
import NewPost from "../../layout/NewPost";
import Post from "../../layout/Post";
import './Home.css';

import checkLoggedIn from "../../../utils/checkLoggedIn";
import PostType from '../../../types/post';

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const newPostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.title = 'Echo | Home';

        const authCheck = async () => {
            if (await checkLoggedIn()) {
                setIsLoggedIn(true);
            };
        };

        authCheck();
        getPosts();
    }, []);

    const getPosts = async () => {
        try {
            const req = await fetch('/api/post/get', {
                method: 'POST'
            });
            const res = await req.json();

            if (res.ok) {
            setPosts(res.data);
            } else {
                console.error("Failed to fetch posts:", res.error);
            };
        } catch (e) {
            console.error("Error fetching posts:", e);
        };
    };

    const handleCreatePost = () => {
        if (newPostRef.current) {
            newPostRef.current.style.display = 'flex';
        } else {
            console.error("New post reference is not set.");
        }
    };

    const handleCreatePostSubmit = () => {
        if (newPostRef.current) {
            newPostRef.current.style.display = 'none';
        } else {
            console.error("New post reference is not set.");
        }
        getPosts();
    };

    const handleCreatePostCancel = () => {
        if (newPostRef.current) {
            newPostRef.current.style.display = 'none';
        } else {
            console.error("New post reference is not set.");
        }
    };

    return (
        <div>
            <Header
                page="home"
                isLoggedIn={isLoggedIn}
            />

            <main className="h-screen mt-20">
                <div>
                    <button
                        className="aspect-square fixed right-4 bottom-4 rounded-full primary"
                        onClick={handleCreatePost}
                        aria-label="Create post">
                        <Plus
                            size={36}
                        />
                    </button>

                    <NewPost
                        ref={newPostRef}
                        onSubmit={handleCreatePostSubmit}
                        onCancel={handleCreatePostCancel}
                    />

                    { posts.length > 0 ? (
                        <div className="h-full w-1/2 flex flex-col gap-4 items-center p-4 border-l border-r border-border mx-auto">
                            {[...posts]
                                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                .map((p, i) => (
                                    <Post
                                        key={i}
                                        id={p.id}
                                        authorId={p.author_id}
                                        authorName={p.author_username}
                                        authorAvatar={p.author_avatar}
                                        content={p.content}
                                        likes={p.likes}
                                        reposts={p.reposts}
                                        saves={p.saves}
                                        comments={p.comments}
                                        createdAt={p.created_at}
                                        isLoggedIn={isLoggedIn}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
                                <h2 className="text-4xl">Be the first to say something!</h2>
                                <p>There are currently no posts available.</p>
                            </div>
                        )
                    }
                </div>
            </main>
        </div>
    );
};

export default Home;