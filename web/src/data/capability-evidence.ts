export type CapabilityEvidence = {
  capability: string
  project: string
  artifact: string
  decision: string
  source: string
  verified: boolean
}

/**
 * Recruiter-facing capability claims resolve to a visible case or artifact.
 * Verification tracks source availability, not commercial outcome.
 */
export const capabilityEvidence: CapabilityEvidence[] = [
  { capability: '3D Design & Visualization', project: 'Hermès', artifact: 'Seasonal spatial boards', decision: 'Merchandise hierarchy, prop scale and sightline composition', source: 'Project archive', verified: true },
  { capability: '3D Design & Visualization', project: 'Arc’teryx', artifact: 'Terrain-to-equipment field sequence', decision: 'Terrain, body and equipment hierarchy', source: 'Project archive', verified: true },
  { capability: 'Brand Systems', project: 'YELISI', artifact: 'Brand, product and CMF archive', decision: 'Connect identity rules to object language', source: 'User-supplied project boards', verified: true },
  { capability: 'Brand Systems', project: 'Periastra', artifact: 'Identity and application archive', decision: 'Compare wordmark, graphic and information rules', source: 'User-supplied project boards', verified: true },
  { capability: 'Design Intelligence', project: 'Aesthetic Atlas', artifact: 'Comparative research interface', decision: 'Turn references into explicit comparison criteria', source: 'Public project case', verified: true },
  { capability: 'AIGC Design Systems', project: 'Lensflow', artifact: 'Brief and reference workflow', decision: 'Frame, compare and recover design tasks', source: 'Public project case', verified: true },
  { capability: 'CMF & Material', project: 'Lighting', artifact: 'Form and material studies', decision: 'Compare form, component relationships and material expression', source: 'Project archive', verified: true },
  { capability: 'Digital Product', project: 'Resume Formatter', artifact: 'Live review and recovery flow', decision: 'Make revisions comparable and reversible', source: 'Public demo and repository record', verified: true },
]
