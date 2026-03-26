import { Component, inject, OnInit } from '@angular/core';
import { PostProfileService } from './post-profile.service';
import { PostsService } from '../../core/services/posts.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly postProfileService = inject(PostProfileService);
  private readonly postsService = inject(PostsService);

  saveFile!: File;

  imgeUrl: string | ArrayBuffer | null | undefined;

  imgeeUrl: string | ArrayBuffer | null | undefined;

  userId = JSON.parse(localStorage.getItem('socialUser')!)._id;

  imgUser = JSON.parse(localStorage.getItem('socialUser')!).photo;

  postsList: Post[] = [];

  contentt: FormControl = new FormControl('');

  ngOnInit(): void {
    this.getAllMyPostData();
  }

  getAllMyPostData(): void {
    this.postProfileService.getMyPosts(this.userId).subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.postsList = res.data.posts;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  getLikes(postId: string): void {
    this.postsService.likeunlikePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllMyPostData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeCover(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      console.log(input.files[0]);
      this.saveFile = input.files[0];

      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.saveFile);

      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        this.imgeUrl = e.target?.result;
      };
    }
  }

  uploadProfile(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      console.log(input.files[0]);
      this.saveFile = input.files[0];

      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.saveFile);

      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        this.imgeeUrl = e.target?.result;
      };
    }
  }

  sumbitForrm(e: Event): void {
    e.preventDefault();
    console.log(this.contentt.value);
    console.log(this.saveFile);

    const formData = new FormData();

    if (this.contentt.value) {
      formData.append('Body', this.contentt.value);
    }

    if (this.saveFile) {
      formData.append('photo', this.saveFile);
    }

    this.postProfileService.UploadProfile().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
