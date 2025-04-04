export const limitedPostsCte = `
    WITH limitedPosts AS (SELECT p.id                AS id,
                                 p.title             AS title,
                                 p.short_description AS shortDescription,
                                 p.content           AS content,
                                 p.blog_id           AS blogId,
                                 b.name              AS blogName,
                                 p.created_at        AS createdAt
                          FROM posts AS p
                                   LEFT JOIN blogs AS b ON b.id = p.blog_id
                          WHERE p.deleted_at IS NULL
                          ORDER BY p.title
                          LIMIT 10 OFFSET 0),
         likesAndDislikes AS (SELECT sp.post_id,
                                     COUNT(sp.status) FILTER (WHERE sp.status = 'Dislike') AS dislikesCount,
                                     COUNT(sp.status) FILTER (WHERE sp.status = 'Like')    AS likesCount
                              FROM statuses_posts AS sp
                              GROUP BY sp.post_id),
         newestLikes AS (SELECT sp.post_id,
                                json_agg(json_build_object(
                                        'addedAt', sp.created_at,
                                        'userId', sp.user_id,
                                        'userLogin', u.login
                                         )) AS likes
                         FROM statuses_posts AS sp
                                  LEFT JOIN users AS u ON u.id = sp.user_id
                         WHERE sp.status = 'Like'
                         GROUP BY sp.post_id),
         userStatus AS (SELECT sp.post_id,
                               sp.status
                        FROM statuses_posts AS sp
                        WHERE sp.user_id = '69fb5530-c80d-40c3-a148-1ee15b88876c')
    SELECT lp.id                         AS id,
           lp.title                      AS title,
           lp.shortDescription           AS shortDescription,
           lp.content                    AS content,
           lp.blogId,
           lp.blogName,
           lp.createdAt,
           COALESCE(us.status, 'None')   AS myStatus,
           COALESCE(ld.dislikesCount, 0) AS dislikesCount,
           COALESCE(ld.likesCount, 0)    AS likesCount,
           nl.likes                      AS newestLikes
    FROM limitedPosts AS lp
             LEFT JOIN likesAndDislikes ld ON ld.post_id = lp.id
             LEFT JOIN newestLikes nl ON nl.post_id = lp.id
             LEFT JOIN userStatus us ON us.post_id = lp.id
    ORDER BY lp.title;
`;
