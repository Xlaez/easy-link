// export const FU = /fuck/gi;
// export const PU = /pussy/gi;
// export const BI = /bitch/gi;
// export const BA = /bastard/gi;
// export const MF = /motherfucker/gi;

/**
 * Words to be filtered for if safeWords setting is activated for a chatroom
 * Update the list as application grows
 */
const filterArr: RegExp[] = [/fuck/gi, /pussy/gi, /bitch/gi, /bastard/gi, /motherfucker/gi];

export class FilterBannedWords {
  constrcutor() {}

  private safeWordsRes: string = 'safewords enabled, your message has a banned word';

  /**Prefer to use if statement over loop */
  public filter = (message: string): string | null => {
    for (let i = 0; i < filterArr.length; i++) {
      if (message.match(filterArr[i])) return this.safeWordsRes;
    }
  };
}
