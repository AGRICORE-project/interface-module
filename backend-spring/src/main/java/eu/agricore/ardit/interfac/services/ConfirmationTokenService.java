package eu.agricore.ardit.interfac.services;

import eu.agricore.ardit.interfac.model.AppUser;
import eu.agricore.ardit.interfac.model.ConfirmationToken;
import eu.agricore.ardit.interfac.repository.ConfirmationTokenRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ConfirmationTokenService {
	
	@Autowired
	private ConfirmationTokenRepository confirmationTokenRepository;

	@Transactional(readOnly = true)
	public Optional<ConfirmationToken> getToken(String token) {
		return confirmationTokenRepository.findByToken(token);
	}

	@Transactional
	public void saveToken(ConfirmationToken token) {
		confirmationTokenRepository.save(token);
	}

	@Transactional
	public ConfirmationToken confirmToken(ConfirmationToken token) {
		token.setConfirmedAt(new Date());
		return confirmationTokenRepository.save(token);
	}
	@Transactional
	public void deleteTokenByUser(AppUser user) {
		confirmationTokenRepository.deleteByUser(user.getId());
	}

	@Transactional(readOnly = true)
	public List<ConfirmationToken> getTokenPasswordByUser(Long userId) {
		return confirmationTokenRepository.getTokenPasswordByUser(userId);
	}

	@Transactional(readOnly = true)
	public List<ConfirmationToken> getTokenRegisterByUser(Long userId) {
		return confirmationTokenRepository.getTokenRegisterByUser(userId);
	}


	@Transactional
	public void deleteToken(ConfirmationToken confirmationToken) {
		confirmationTokenRepository.delete(confirmationToken);
	}

}
