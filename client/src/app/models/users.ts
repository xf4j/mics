export class User{
    username: string|null;
    email: string| null;
    userId: number | null;
    token: string|null;
    profile: UserProfile| null;
    isStaff: boolean;
    constructor(
        username: string|null = null,
        email: string|null = null,
        userId: number|null = null,
        token: string|null = null,
        profile: UserProfile|null = null,
        isStaff: boolean = false
    ){
        this.update(username, email, userId, token, profile, isStaff);
    }

    update(
        username: string|null = null,
        email: string|null = null,
        userId: number|null = null,
        token: string|null = null,
        profile: UserProfile | null = null,
        isStaff: boolean = false
    ){
        this.username = username;
        this.email = email;
        this.userId = userId;
        this.token = token;
        this.profile = profile;
        this.isStaff = isStaff;
    }

    reset(){
        this.update();
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

