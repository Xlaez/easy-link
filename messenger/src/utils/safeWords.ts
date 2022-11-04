/**
 * Words to be filtered for if safeWords setting is activated for a chatroom
 * Update the list as application grows
 */
const filterArr: RegExp[] = [/fuck/gi, /pussy/gi, /bitch/gi, /bastard/gi, /motherfucker/gi];

export class FilterBannedWords {
  constrcutor() {}

  protected static safeWordsRes: string = 'safewords enabled, your message has a banned word';

  /**Prefer to use if statement over loop */
  static filter = (message: string): string | null => {
    for (let i = 0; i < filterArr.length; i++) {
      if (message.match(filterArr[i])) return this.safeWordsRes;
    }
  };
}
