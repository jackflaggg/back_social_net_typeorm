import { z } from 'zod';

export const sortDirectionOrm = z.enum(['ASC', 'DESC']);
export type sortDirectionOrmByEnum = z.infer<typeof sortDirectionOrm>;
export const UsersSortByValues = sortDirectionOrm.options;
