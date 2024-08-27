export type Where = {
  [key: string]: {
    contains?: string;
    equals?: string | number;
    in?: any;
    gte?: string;
    lte?: string;
  };
};

export type ShowParams = {
  id: number;
  select?: object;
};
export function parseWhere(whereString: string | undefined): Where | undefined {
  console.log('===========whereeee=======', whereString);
  if (whereString === undefined) {
    console.log('==========invalid=========');
    return {};
  } else {
    try {
      return JSON.parse(whereString) as Where;
    } catch (error) {
      console.error('Error parsing where clause:', error);
      return {};
    }
  }
}
export type GetListParams = {
  where?: Where;
  skip?: number;
  take?: number;
  orderBy?: Array<object>;
  q?: string;
  include?: Array<string>;
  select?: object;
};

export type ParseRequest =
  | {
      query:
        | {
            select?: Array<string>;
            pagination?: { page: number; perPage: number };
            sort?: { field: string; order: 'ASC' | 'DESC' };
            filter?: object;
          }
        | any;
    }
  | any;
