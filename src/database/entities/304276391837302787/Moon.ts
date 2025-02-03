import { Column, Entity, IsNull } from "typeorm";
import BaseEntity from "../../../contracts/BaseEntity";
import AppDataSource from "../../dataSources/appDataSource";

@Entity()
export default class Moon extends BaseEntity {
    constructor(moonNumber: number, description: string, userId: string) {
        super();

        this.MoonNumber = moonNumber;
        this.Description = description;
        this.UserId = userId;
    }

    @Column()
    MoonNumber: number;

    @Column()
    Description: string;

    @Column({ nullable: true })
    WhenArchived?: Date;

    @Column()
    UserId: string;

    public static async FetchMoonsByUserId(userId: string): Promise<Moon[] | null> {
        const repository = AppDataSource.getRepository(Moon);

        const all = await repository.find({ where: { UserId: userId } });

        return all;
    }

    public static async FetchPaginatedMoonsByUserId(userId: string, pageLength: number, page: number): Promise<[ Moon[], number ]> {
        const rangeStart = page * pageLength;

        const repository = AppDataSource.getRepository(Moon);

        const moons = await repository.findAndCount({
            where: { UserId: userId, WhenArchived: IsNull() },
            order: { MoonNumber: "ASC" },
            skip: rangeStart,
            take: pageLength,
        });

        return moons;
    }

    public static async FetchMoonCountByUserId(userId: string): Promise<number> {
        const repository = AppDataSource.getRepository(Moon);

        const count = await repository.count({ where: { UserId: userId } });

        return count;
    }
}
