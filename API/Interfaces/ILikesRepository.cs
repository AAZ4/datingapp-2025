using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<MemberLike?> GetMemberLike(string sourceMemberId, string likedMemberId);
    Task<PaginatedResult<Member>> GetMemberLikes(LikesParam likesParam);
    Task<IReadOnlyList<string>> GetCurrentUserLikedMembersIds(string memberId);
    void DeleteLike(MemberLike like);
    void AddLike(MemberLike like);

}
