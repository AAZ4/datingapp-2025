import { DatePipe } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';
import { EditableMember, Member } from '../../../types/member';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-memeber-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipe],
  templateUrl: './memeber-profile.html',
  styleUrl: './memeber-profile.css',
})
export class MemeberProfile implements OnInit, OnDestroy {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notification($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  private toast = inject(ToastService);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    city: '',
    country: '',
  };

  ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = {
      ...this.memberService.member(),
      ...this.editableMember
    }
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName !== currentUser.displayName) {
          currentUser.displayName = updatedMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }
        this.toast.success('Profile updated successfully');
        this.memberService.editMode.set(false);
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.reset(this.editableMember);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}
