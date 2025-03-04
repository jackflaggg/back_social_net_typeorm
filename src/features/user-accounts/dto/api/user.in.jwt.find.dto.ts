export interface findUserByLoginOrEmailInterface {
    id: string;
    email: string;
    password: string;
    isConfirmed: boolean;
    confirmationCode: string;
}