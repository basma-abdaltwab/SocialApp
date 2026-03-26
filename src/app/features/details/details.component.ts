import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../core/services/posts.service';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
    
  postId: string = "";

  postDetails: Post = {} as Post;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      console.log(param.get('id'));
      this.postId = param.get('id')!;
      this.getPostDetails()
    });
  }

  getPostDetails(): void{
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        console.log(res);
       this.postDetails= res.data.post

      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  
}
 