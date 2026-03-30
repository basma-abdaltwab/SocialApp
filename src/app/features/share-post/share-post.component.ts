import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-post',
  imports: [ReactiveFormsModule],
  templateUrl: './share-post.component.html',
  styleUrl: './share-post.component.css',
})
export class SharePostComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly router = inject(Router);

  content: FormControl = new FormControl('');
  privacy: FormControl = new FormControl('Onlyme');

  postId: string = '';
  SharedPost: Post = {} as Post;
  
  saveFile!: File;
  imgURL: string | ArrayBuffer | null | undefined;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      console.log(param.get('id'));

      this.postId = param.get('id')!;
      this.getSharaPost();
    });
  }

  getSharaPost(): void {
    this.postsService.sharePost(this.postId, FormData).subscribe({
      next: (res) => {
        console.log(res);
        this.SharedPost = res.data.post;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  SubmitForm(e: Event): void {
    e.preventDefault();

    console.log(this.content.value);
    console.log(this.privacy.value);

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

    this.postsService.sharePost(this.postId, formData).subscribe({
      next: (response) => {
        this.router.navigate(['/feed']);
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

  getSharedPost(): void{
    this.postsService.sharePost(this.postId, FormData).subscribe({
      next: (res) => {
        this.content.setValue(res.data.post.body);
        this.privacy.setValue(res.data.post.privacy);
        this.imgURL = res.data.post.image;
      },

      
    });
  }
}
