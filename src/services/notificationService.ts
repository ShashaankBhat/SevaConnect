import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { createAlert } from './controllers/alertController';

class NotificationService {
  private io: SocketServer | null = null;

  initialize(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: "http://localhost:8081",
        methods: ["GET", "POST"]
      }
    });

    this.io.on('connection', (socket) => {
      console.log('🔌 User connected:', socket.id);

      // Join room for specific NGO
      socket.on('join-ngo', (ngoId: string) => {
        socket.join(`ngo-${ngoId}`);
        console.log(`User ${socket.id} joined NGO room: ${ngoId}`);
      });

      // Join room for admin
      socket.on('join-admin', () => {
        socket.join('admin-room');
        console.log(`User ${socket.id} joined admin room`);
      });

      socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
      });
    });

    console.log('✅ WebSocket server initialized');
  }

  // Send notification to specific NGO
  sendToNGO(ngoId: string, type: string, data: any) {
    if (this.io) {
      this.io.to(`ngo-${ngoId}`).emit('notification', {
        type,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Send notification to all admins
  sendToAdmin(type: string, data: any) {
    if (this.io) {
      this.io.to('admin-room').emit('admin-notification', {
        type,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Send notification to all connected clients
  broadcast(type: string, data: any) {
    if (this.io) {
      this.io.emit('broadcast', {
        type,
        data,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const notificationService = new NotificationService();
