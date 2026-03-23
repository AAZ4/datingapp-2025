import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../types/member';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-memeber-profile',
  imports: [DatePipe],
  templateUrl: './memeber-profile.html',
  styleUrl: './memeber-profile.css',
})
export class MemeberProfile {
  private route = inject(ActivatedRoute);
  protected member = signal<Member | undefined>(undefined);

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.member.set(data['member']);
    });
  }
}
