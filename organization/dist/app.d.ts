import express, { Application } from 'express';
import { Routes } from './interfaces/routes';
declare class App {
    app: Application;
    env: string;
    port: string | number;
    constructor(routes: Routes[]);
    listen(): void;
    getServer(): express.Application;
    initializeMiddlewares(): void;
    private initializeRoutes;
    private initializaDB;
    private initalizeErrorHandling;
}
export default App;
