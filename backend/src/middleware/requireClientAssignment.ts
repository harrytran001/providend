import { Request, Response, NextFunction } from "express";
import * as assignmentRepository from '../repositories/assignmentRepository';

/**
 * Param middleware: when a route has :clientId, check that the current user
 * (req.authorId, set by mockAuth) is assigned to that client. 403 if not.
 * Attach with notesRouter.param('clientId', requireClientAssignment).
 */
export async function requireClientAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
  clientIdParam: string,
): Promise<void> {
  const clientId =
    typeof clientIdParam === "string"
      ? clientIdParam
      : ((clientIdParam as unknown as string[])?.[0] ?? "");
  const authorId = req.authorId;
  if (!authorId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const assigned = await assignmentRepository.isAssigned(clientId, authorId);
  if (!assigned) {
    res.status(403).json({ error: "Not authorized for this client" });
    return;
  }
  next();
}
