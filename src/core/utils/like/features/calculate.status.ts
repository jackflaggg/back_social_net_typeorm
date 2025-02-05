import { StatusLike } from '../../../../libs/contracts/enums/status.like';

export function calculateStatus(currentStatus: string, changedStatus: string) {
    let likesCount = 0;
    let dislikesCount = 0;

    if (currentStatus === StatusLike.enum['Like'] && changedStatus === StatusLike.enum['Dislike']) {
        likesCount = -1;
        dislikesCount = 1;
    }

    if (currentStatus === StatusLike.enum['Like'] && changedStatus === StatusLike.enum['None']) {
        likesCount = -1;
        dislikesCount = 0;
    }

    if (currentStatus === StatusLike.enum['Dislike'] && changedStatus === StatusLike.enum['None']) {
        likesCount = 0;
        dislikesCount = -1;
    }

    if (currentStatus === StatusLike.enum['Dislike'] && changedStatus === StatusLike.enum['Like']) {
        likesCount = 1;
        dislikesCount = -1;
    }

    if (currentStatus === StatusLike.enum['None'] && changedStatus === StatusLike.enum['Like']) {
        likesCount = 1;
        dislikesCount = 0;
    }

    if (currentStatus === StatusLike.enum['None'] && changedStatus === StatusLike.enum['Dislike']) {
        likesCount = 0;
        dislikesCount = -1;
    }

    // if (currentStatus === commentStatus.DISLIKE && changedStatus === commentStatus.DISLIKE) {
    //     likesCount = 0
    //     dislikesCount = -1
    // }
    //
    // if (currentStatus === commentStatus.LIKE && changedStatus === commentStatus.LIKE) {
    //     likesCount = -1
    //     dislikesCount = 0
    // }

    return { likesCount, dislikesCount };
}
