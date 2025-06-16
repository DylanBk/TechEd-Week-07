import React from 'react';

type Props = {
    onSubmit: () => void,
    onCancel: () => void
};

const NewPost = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            const form = new FormData(e.currentTarget);
            const formData = Object.fromEntries(form);

            const req = await fetch('/api/post/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });
            const res = await req.json();

            if (res.ok) {
                props.onSubmit();
            } else {
                console.error("Failed to create post:", res.error);
            };
        } catch (e) {
            console.error("Error during form submission:", e);
        };
    };

    const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('cancelled')
        props.onCancel();
    };

    return (
        <div className="modal" ref={ref}>
            <div className="modal-overlay"></div>

            <form
                className="modal-form"
                onSubmit={handleFormSubmit}>
                <h2>Create a new post</h2>

                <div>
                    <label className="text-base" htmlFor="content">What's on your mind?:</label>

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
                        onClick={(e) => handleCancel(e)}>
                        Cancel
                    </button>

                    <button
                        className="absolute right-8 primary"
                        type="submit">
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
});

export default NewPost;