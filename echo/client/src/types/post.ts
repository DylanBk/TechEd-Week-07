export default interface Post {
    id: number,
    author_id: number,
    author_username: string,
    author_avatar: string,
    content: string,
    created_at: string,
    likes: number,
    reposts: number,
    saves: number,
    comments: number
};