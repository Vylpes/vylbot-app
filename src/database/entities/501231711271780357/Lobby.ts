import { Column, Entity } from "typeorm";
import BaseEntity from "../../../contracts/BaseEntity";
import AppDataSource from "../../dataSources/appDataSource";

@Entity()
export default class Lobby extends BaseEntity {
    constructor(channelId: string, roleId: string, cooldown: number, name: string) {
        super();

        this.ChannelId = channelId;
        this.RoleId = roleId;
        this.Cooldown = cooldown;
        this.Name = name;

        this.LastUsed = new Date(0);
    }

    @Column()
    public ChannelId: string;

    @Column()
    public RoleId: string;

    @Column()
    public Cooldown: number;

    @Column()
    public LastUsed: Date;

    @Column()
    public Name: string;

    public MarkAsUsed() {
        this.LastUsed = new Date();
    }

    public static async FetchOneByChannelId(channelId: string, relations?: string[]): Promise<Lobby | null> {
        const repository = AppDataSource.getRepository(Lobby);

        const single = await repository.findOne({ where: { ChannelId: channelId }, relations: relations || [] });

        return single;
    }
}