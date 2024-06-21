"use client"
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const HelloPage = () => {
    const [responseData, setResponseData] = useState(null);
    const [count, setCount] = useState(0);
    const [posts, setPosts] = useState([]);
    const [authorEId, setAuthorEId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { toast } = useToast();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            // User is already authenticated, redirect to homepage
            setLoading(false);
            setAuthorEId(session.user.email);
        } else if (status === "loading") {
            // Session is still loading, do nothing (optional)
        } else {
            redirect("/");
            toast({
                title: "Login Required",
                description: "You have to be logged in to author a post",
            });
            // User is not authenticated, continue rendering the component
        }
    }, [session, status, redirect, setAuthorEId]);


    const handleClick = async () => {
        try {
            const response = await fetch('http://localhost:5000/'); 
            const data = await response.json();
            setResponseData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCount = async () => {
        try {
            const response = await fetch('http://localhost:5000/count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ count: parseInt(count) })
            }); 
            const data = await response.json();
            setResponseData(data);
            console.log(data.new_count)
            setCount(data.new_count)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch("/api/fetchallblogs", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setPosts(data);
            setLoading(false);
            const response_flask = await fetch('http://localhost:5000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(posts)
            }); 
            const data_flask = await response_flask.json();
            
            console.log(data_flask)
           
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="pt-24">
            <button onClick={handleClick}>
                hello
            </button>
            {responseData && (
                <div>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}

            <div className="flex flex-col w-full mt-4 ">
                <label className="mb-2 text-2xl ">Category:</label>
                <Input
                    type="number"
                    className="w-full border border-zinc-600 "
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                />
            </div>
            <button
                className=" mt-8 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                onClick={handleCount}
            >
                Increase Count
            </button>
            <button
                className=" mt-8 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                onClick={fetchPosts}
            >
                Fetch Posts
            </button>
            <div className="flex flex-col items-center w-full px-8 pt-24">
            <h1 className="text-4xl">All Blog Posts</h1>
            {posts.length > 0 ? (
                <ul className="w-full mt-8">
                    {posts.map((post) => (
                        <li
                            key={post._id}
                            onClick={() => router.push(`/blogs/${post._id}`)}
                            className="p-4 mb-4 border rounded-md shadow-md cursor-pointer dark:bg-zinc-800 bg-slate-100"
                        >
                            <h2 className="text-2xl duration-300 hover:text-blue-500">
                                {post.title}
                            </h2>
                            {/* <p>{post.content}</p> */}
                            <p className="text-sm">
                                Author: {post.author.name} ({post.author.email})
                            </p>
                            <p className="text-sm">Category: {post.category}</p>
                            <p className="text-sm">
                                Created At:{" "}
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts found.</p>
            )}
        </div>
        </div>
    );
};

export default HelloPage;
