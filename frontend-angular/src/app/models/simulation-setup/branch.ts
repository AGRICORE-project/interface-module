export interface Branch {
    name:      string;
    commit:    Commit;
    protected: boolean;
}

export interface Commit {
    sha: string;
    url: string;
}
