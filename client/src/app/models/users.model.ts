export interface IUser {
    username: string;
    email: string;
    id: number;
    profile: UserProfile | null;
}

interface ILoginUser {
    username: string;
    email: string;
    id: number;
    profile: UserProfile | null;
    token: string;
    exp: number;
    is_staff: boolean;
}

export class User{
    username: string|null;
    email: string| null;
    userId: number | null;
    profile: UserProfile| null;

    constructor( user?: IUser
    ){
        this.updateUser(user);
    }

    updateUser(user?: IUser){
        const {username, email, id, profile} = {username: '', email: '', id: -1, profile: null, ...user};
        this.username = username;
        this.email = email;
        this.userId = id;
        this.profile = profile;
    }

}

export class LoginUser extends User{
    exp: number|null;
    token: string | null;
    is_staff: boolean;
    constructor(user?: ILoginUser){
        super(user);
        this.updateLoginUser(user);
    }

    updateLoginUser(user?: ILoginUser){
        const {token, exp, is_staff} = {token: '', exp: -1, is_staff: false, ...user};
        super.updateUser(user);
        this.token = token;
        this.exp = exp;
        this.is_staff = is_staff;
    }
}

export class UserProfile{
    is_admin: boolean;
    organization: number;
    constructor(
        profile: {is_admin: boolean,
        organization: number}
    ){
        this.update(profile);
    }
    update(
        profile: {is_admin: boolean,
        organization: number| null}
    ){
        const {is_admin, organization} = {is_admin: false, organization: '', ...profile};
        this.is_admin = is_admin;
        this.organization = organization;
    }
}

export interface IOrgList{
    id: number;
    name: string;
}

export class Organization{
    id: number;
    name: string;
    constructor(organization: IOrgList){
        const {id, name} = {id: -1, name: '', ...organization};
        this.id = id;
        this.name = name;
    }
}
