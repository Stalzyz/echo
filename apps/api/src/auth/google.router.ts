import { FastifyInstance } from 'fastify';

export default async function googleAuthRouter(app: FastifyInstance) {
  // POST /api/v1/auth/google
  app.post('/google', async (req, reply) => {
    const { email, googleId, name, photoUrl } = req.body as {
      email: string;
      googleId?: string;
      name?: string;
      photoUrl?: string;
    };

    if (!email) {
      return reply.status(400).send({ error: 'Email address is required for Google authentication' });
    }

    // Check if user already exists
    let user = await app.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // 🔒 STRICT SECURITY GUARD: Block Academy Administrators from using Google OAuth
    if (user && (user.role === 'SUPER_ADMIN' || user.role === 'MANAGER')) {
      return reply.status(403).send({
        error: 'ADMIN_LOGIN_RESTRICTED',
        message: 'Academy Administrators must sign in using Corporate Email/Password or Verified Mobile OTP only.'
      });
    }

    // Create user if not existing (Default new Google users to STUDENT role)
    if (!user) {
      const [firstName, ...rest] = (name || 'Google Learner').split(' ');
      const lastName = rest.join(' ') || 'User';

      user = await app.prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          firstName,
          lastName,
          role: 'STUDENT',
          passwordHash: 'google_oauth_user',
          status: 'ACTIVE',
          avatarUrl: photoUrl || undefined
        }
      });
    }

    // Ensure Student record exists if user is STUDENT
    if (user.role === 'STUDENT') {
      const existingStudent = await app.prisma.student.findUnique({ where: { userId: user.id } });
      if (!existingStudent) {
        const studentCode = `STU-${Date.now().toString().slice(-6)}`;
        const codeName = (user.firstName || 'STU').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const referralCode = `GREKAM-${codeName}-${Math.floor(1000 + Math.random() * 9000)}`;
        await app.prisma.student.create({
          data: {
            userId: user.id,
            studentCode,
            referralCode
          }
        });
      }
    }

    return {
      success: true,
      message: 'Google OAuth authentication successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    };
  });
}
