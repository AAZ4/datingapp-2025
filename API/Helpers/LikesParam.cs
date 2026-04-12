using System;

namespace API.Helpers;

public class LikesParam : PagingParams
{
    public string Predicate { get; set; } = "liked";
    public string MemberId { get; set; } ="";
}
