import { Column, Entity, getConnection } from "typeorm";
import BaseEntity from "../../contracts/BaseEntity";

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

    public static async FetchOneByChannelId(channelId: string, relations?: string[]): Promise<Lobby | undefined> {
        const connection = getConnection();

        const repository = connection.getRepository(Lobby);

        const single = await repository.findOne({ ChannelId: channelId }, { relations: relations || [] });

        return single;
    }
}