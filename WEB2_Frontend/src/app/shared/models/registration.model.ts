export class RegistrationModel{
    username: string = "";
    password: string = "";
    name: string = "";
    lastname: string = "";
    email: string = "";
    address: string = "";
    userType: string = "";
    verified: boolean = false;
    birthDate: Date = new Date;
    denied: boolean = false;
    image: any;
}