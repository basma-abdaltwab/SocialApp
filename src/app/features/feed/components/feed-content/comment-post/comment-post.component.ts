import { Component, inject, Input, OnInit } from '@angular/core';
import { CommentsService } from './comments.service';
import { Comment } from './comment.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-comment-post',
  imports: [ReactiveFormsModule],
  templateUrl: './comment-post.component.html',
  styleUrl: './comment-post.component.css',
})
export class CommentPostComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);

  content: FormControl = new FormControl('');

  @Input() postId: string = '';
  

  commentsList: Comment[] = [];
  saveFile!: File;

  imageURL: string | ArrayBuffer | null | undefined;

  ngOnInit(): void {
    this.getCommentPost();
  }

  getCommentPost(): void {
    this.commentsService.getPostComment(this.postId).subscribe({
      next: (res) => {
        console.log(res);
        this.commentsList = res.data.comments;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  chooseImg(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log(input.files[0]);

      this.saveFile = input.files[0];
      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.saveFile);
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        this.imageURL = e.target?.result;
      };
    }
  }

  CloseImg(e: Event): void {
    e.preventDefault();
    this.imageURL = '';
  }

  submitCommentForm(e: Event , form:HTMLFormElement): void {
    e.preventDefault();
    console.log(this.content.value);
    console.log(this.saveFile);

    const formData = new FormData();

    if (this.content.value) {
      formData.append('content', this.content.value);
    }

    if (this.saveFile) {
      formData.append('image', this.saveFile);
    }

    this.commentsService.createComment(this.postId, formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          form.reset();
          this.imageURL = "";
          this.getCommentPost();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteCommentPost(commentId: string): void {
    this.commentsService.deleteComment(this.postId , commentId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getCommentPost();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getLikeCommentPost(commentId:string): void {
    this.commentsService.getLikeComment(this.postId, commentId).subscribe({
      next:(res) => {
        console.log(res);
         if (res.success) {
           this.getCommentPost();
         }
           
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  
}
