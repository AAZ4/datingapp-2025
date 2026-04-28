using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace API.Data;

public class PhotoRepository(AppDbContext context) : IPhotoRepository
{
    public async Task<IReadOnlyList<PhotoForApprovalDto>> GetUnapprovedPhotos()
    {
        return await context.Photos
            .IgnoreQueryFilters()
            .Where(p => !p.IsApproved)
            .Select(u => new PhotoForApprovalDto
            {
                Id = u.Id,
                Url = u.Url,
                UserId = u.MemberId,
                IsApproved = u.IsApproved
            })
            .ToListAsync();
    }

    public async Task<Photo?> GetPhotoById(int id)
    {
        return await context.Photos
            .IgnoreQueryFilters()
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public void RemovePhoto(Photo photo)
    {
        context.Photos.Remove(photo);
    }

}
