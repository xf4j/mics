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
    constructor(user?: ILoginUser){
        super(user);
        this.updateLoginUser(user);
    }

    updateLoginUser(user?: ILoginUser){
        const {token, exp} = {token: '', exp: -1, ...user};
        super.updateUser(user);
        this.token = token;
        this.exp = exp;
    }
}

export class UserProfile{
    isAdmin: boolean;
    organization: string;
    constructor(
        profile: {isAdmin: boolean,
        organization: string}
    ){
        this.update(profile);
    }
    update(
        profile: {isAdmin: boolean,
        organization: string}
    ){
        const {isAdmin, organization} = {isAdmin: false, organization: '', ...profile};
        this.isAdmin = isAdmin;
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
