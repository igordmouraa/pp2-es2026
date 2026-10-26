export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}
export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}
export interface Usuario {
    id: number;
    name: string;
    email: string;
    address: {
        city: string
    },
    company: {
        name: string;
    }
}

export interface Comentario {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}
