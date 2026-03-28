import { CanDeactivateFn } from '@angular/router';
import { MemeberProfile } from '../../features/members/memeber-profile/memeber-profile';

export const preventUnsavedChnagesGuard: CanDeactivateFn<MemeberProfile> = (component) => {
  if (component.editForm?.dirty) {
    return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
  }

  return true;
};
