import {
  Short,
  ShortCreateInput,
  ShortTag,
} from '@graduates/api/shorts/api/shared/entities/data-access';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GetAllShortsQuery,
  GetShortByIdQuery,
  GetShortByTagQuery,
  GetShortByUserQuery,
  GetUserByIdQuery,
  GetTagByIdQuery,
} from './queries/api-shorts-query.query';
import {
  CreateShortCommand,
  DeleteShortCommand,
} from './commands/api-shorts-command.command';
import { User } from '@graduates/api/authentication/api/shared/interfaces/data-access';

@Injectable()
export class ShortsService {
  /**
   * Constructor - injects QueryBus and CommandBus
   * @param {QueryBus} queryBus The query bus
   * @param {CommandBus} commandBus The command bus
   */
  constructor(
    private readonly queryBus: QueryBus,
    private commandBus: CommandBus
  ) {}

  /**
   * Find all shorts from database
   * @return {Promise<Short[]>}
   */
  async findAllShorts(): Promise<Short[]> {
    return await this.queryBus.execute(new GetAllShortsQuery());
  }

  /**
   * Find a short by id
   * @param {string} id The id of the short to find
   * @return {Promise<Short | null>}
   */
  async findShortById(id: string): Promise<Short> {
    return await this.queryBus.execute(new GetShortByIdQuery(id));
  }

  /**
   * Find a tag by short id
   * @param {string} id The id of the tags to find
   * @return {Promise<ShortTag[]>}
   */
  async findTagsByShortId(id: string): Promise<ShortTag[]> {
    return await this.queryBus.execute(new GetTagByIdQuery(id));
  }

  async findUserById(id: string): Promise<User> {
    return await this.queryBus.execute(new GetUserByIdQuery(id));
  }

  /**
   * Find all shorts by user id
   * @param {string} userId The id of the user to find the shorts for
   * @return {Promise<Short[] | null>}
   */
  async findShortsByUser(userId: string): Promise<Short[]> {
    return await this.queryBus.execute(new GetShortByUserQuery(userId));
  }

  /**
   * Find all shorts by tag id
   * @param {string} tagId The id of the tag to find the shorts for
   * @return {Promise<Short[] | null>}
   */
  async findShortsByTag(tagId: string): Promise<Short[]> {
    return await this.queryBus.execute(new GetShortByTagQuery(tagId));
  }

  /**
   * Create a new short
   * @param {ShortCreateInput} short The short to create
   * @param {string} userId The id of the user to create the short for
   * @return {Promise<Short | null>}
   */
  async createShort(
    short: ShortCreateInput,
    // tags: string[],
    userId: string
  ): Promise<Short> {
    return await this.commandBus.execute(
      new CreateShortCommand(short, userId)
      // new CreateShortCommand(short, tags, userId)
    );
  }

  /**
   * Delete a short
   * @param {string} id The id of the short to delete
   * @return {Promise<Short | null>}
   */
  async deleteShort(id: string): Promise<Short | null> {
    return await this.commandBus.execute(new DeleteShortCommand(id));
  }
}
