import { Column, Entity } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";
import AppDataSource from "../dataSources/appDataSource";

@Entity()
export default class Moon extends BaseEntity {
    constructor(description: string, userId: string) {
        super();

        this.Description = description;
        this.UserId = userId;
    }
    
    @Column()
    Description: string;

    @Column()
    UserId: string;

    public static async FetchMoonsByUserId(userId: string): Promise<Moon[] | null> {
        const repository = AppDataSource.getRepository(Moon);

        const all = await repository.find({ where: { UserId: userId } });

        return all;
    }
}
