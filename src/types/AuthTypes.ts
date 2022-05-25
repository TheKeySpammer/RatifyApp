export type UserType = {
    id: number;
    first_name: string;
    last_name: string;
    verified: boolean;
    img: string;
    last_seen: string;
    role: number;
};

export type Organization = {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    created_at: string;
    updated_at: string;
    clientLogo: string | null;
}

export type AuthInitialStateType = {
    isAuthenticated: boolean;
    user: UserType | null;
    error: boolean;
    loading: boolean;
    message: string;
    image: string | null;
};

export type LoginDataType = {
    email: string;
    password: string;
};

export type SignUpDataType = {
    email: string;
    password: string;
    confirm_password: string;
};

export type TokenType = {
    access: string;
    refresh: string;
};

export type JWTType = {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
};

export interface BaseResponse {
    status: string;
    message: string;
}
