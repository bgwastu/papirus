export default interface Note {
  $id: string;
  content: string;
  timestamp: number;
  $read: string[];
  $write: string[];
}
