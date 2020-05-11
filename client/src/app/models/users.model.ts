export class User{
    username: string|null;
    email: string| null;
    userId: number | null;
    // token: string|null;
    profile: UserProfile| null;
    isStaff: boolean;

    constructor(
        username: string|null = null,
        email: string|null = null,
        userId: number|null = null,
        // token: string|null = null,
        profile: UserProfile|null = null,
        isStaff: boolean = false,
    ){
        this.updateUser(username, email, userId, profile, isStaff);
    }

    updateUser(
        username: string|null = null,
        email: string|null = null,
        userId: number|null = null,
        // token: string|null = null,
        profile: UserProfile | null = null,
        isStaff: boolean = false,
    ){
        this.username = username;
        this.email = email;
        this.userId = userId;
        // this.token = token;
        this.profile = profile;
        this.isStaff = isStaff;
    }

    reset(){
        this.updateUser();
    }
}

export class LoginUser extends User{
    exp: number|null;
    token: string | null;
    constructor(
        username: string|null = null,
        email: string|null = null,
        userId: number|null = null,
        profile: UserProfile|null = null,
        isStaff: boolean = false,
        token: string|null = null,
        exp: number|null = null
    ){
        super(username, email, userId, profile, isStaff);
        this.token = token;
        this.exp = exp;
    }

    updateLoginUser(
        username: string|null = null,
        email: string|null = null,
        userId: number|null = null,
        profile: UserProfile | null = null,
        isStaff: boolean = false,
        token: string|null = null,
        exp: number|null = null
    ){
        super.updateUser(username, email, userId, profile, isStaff);
        this.token = token;
        this.exp = exp;
    }
}

export class UserProfile{
    isAdmin: boolean;
    organization: string;
    constructor(
        isAdmin: boolean = false,
        organization: string|null = null
    ){
        this.update(isAdmin, organization);
    }
    update(
        isAdmin: boolean = false,
        organization: string|null = null
    ){
        this.isAdmin = isAdmin;
        this.organization = organization;
    }
}
