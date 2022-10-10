import { Router } from 'express';
export interface Routes {
    path?: string;
    router: Router;
}
export interface Routes2 {
    path?: string;
    path2?: string;
    router: Router;
}
