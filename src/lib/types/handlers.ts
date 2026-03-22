export type CommandContext = {
  command: string;
  args: string[];
};

export type EventContext = {
  event: string;
  args: string[];
};

export interface Command {
  name: string;
  aliases: string[];
  description: string;
  execute: typeof HandleCommand;
}

export interface Event {
  name: string;
  execute: typeof HandleEvent;
}

export declare function HandleCommand<T extends CommandContext>(context: T): Promise<void>;

export declare function HandleEvent<T extends EventContext>(context: T): Promise<void>;