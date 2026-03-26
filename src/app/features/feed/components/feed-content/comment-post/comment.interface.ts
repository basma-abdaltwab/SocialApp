


 export interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
   parentComment: null;
   image: String;
  likes: any[];
  createdAt: string;
  repliesCount: number;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}