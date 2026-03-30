import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../../../core/services/posts.service';
import { CommentPostComponent } from './comment-post/comment-post.component';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, CommentPostComponent, RouterLink],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  content: FormControl = new FormControl('');
  privacy: FormControl = new FormControl('public');

  postsList: Post[] = [];
  userId: string = '';
  saveFile!: File;
  imgURL: string | ArrayBuffer | null | undefined;

  ngOnInit(): void {
    this.getAllPostsData();
    this.userId = JSON.parse(localStorage.getItem('socialUser')!)?._id;
  }

  getAllPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.postsList = res.data.posts;
      },
      error:(err) => {
        console.log(err);
      },
    });
  }

  getLikes(postId: string): void {
    this.postsService.likeunlikePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeImg(e: Event): void {
    //  file
    const input = e.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      console.log(input.files[0]);

      this.saveFile = input.files[0];

      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.saveFile);
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        this.imgURL = e.target?.result;
      };
    }
  }

  closeImg(): void {
    this.imgURL = '';
  }

  submitForm(e: Event , from:HTMLFormElement): void {
    e.preventDefault();

    console.log(this.content.value);
    console.log(this.privacy.value);
    console.log(this.saveFile);

    const formData = new FormData();

    if (this.content.value) {
      formData.append('body', this.content.value);
    }
    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }

    if (this.saveFile) {
      formData.append('image', this.saveFile);
    }

    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          from.reset();
          this.imgURL = "";
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deletePosts(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostsData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

 
}
