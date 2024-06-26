export type Repository = {
    id: number;
    name: string;
    description: string;
    stargazers_url: string;
    stargazers_count: string;
    full_name: string;
    owner: {
        login: string;
    }
}

